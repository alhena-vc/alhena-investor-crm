#!/usr/bin/env npx tsx
// scripts/seed-investors.ts
// Usage: npx tsx scripts/seed-investors.ts ./data/investors.xlsx
// npm install xlsx @supabase/supabase-js tsx dotenv

import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type RawRow = Record<string, string | number | null>

const SHEET_TO_CATEGORY: Record<string, string> = {
  'Инвесторы_фонды': 'fund',
  'Инвесторы_корпораты': 'corporate',
  'Бизнес-ангелы': 'angel',
  'Зарубежные фонды': 'foreign',
}

async function seed(filePath: string) {
  const wb = XLSX.readFile(filePath)
  const results = { inserted: 0, skipped: 0, errors: 0 }

  for (const [sheetName, category] of Object.entries(SHEET_TO_CATEGORY)) {
    const sheet = wb.Sheets[sheetName]
    if (!sheet) {
      console.log(`⚠️  Sheet "${sheetName}" not found — skipping`)
      continue
    }

    const rows: RawRow[] = XLSX.utils.sheet_to_json(sheet, { defval: null })
    console.log(`📋 ${sheetName}: ${rows.length} rows`)

    const investors = rows
      .filter((r) => r['Название'] && String(r['Название']).trim())
      .map((r) => ({
        category,
        name: String(r['Название']).trim(),
        description: r['Описание'] ? String(r['Описание']).trim() : null,
        status: r['Статус'] ? String(r['Статус']).trim() : null,
        invest_phase: r['Инвест фаза'] ? String(r['Инвест фаза']).trim() : null,
        sectors: r['Сферы инвестирования (IT, медицина и тд)']
          ? String(r['Сферы инвестирования (IT, медицина и тд)']).trim()
          : null,
        stages: r['На какие стадии инвестирует']
          ? String(r['На какие стадии инвестирует']).trim()
          : null,
        geography: r['География'] ? String(r['География']).trim() : null,
        portfolio_examples: r['Примеры портфельных компаний']
          ? String(r['Примеры портфельных компаний']).trim()
          : null,
        check_size: r['Размер чека'] ? String(r['Размер чека']).trim() : null,
        contact: r['Контакт'] ? String(r['Контакт']).trim() : null,
        comment: r['Комментарий'] ? String(r['Комментарий']).trim() : null,
        legal_name: r['Название ЮЛ'] ? String(r['Название ЮЛ']).trim() : null,
        inn: r['ИНН'] ? String(r['ИНН']).trim() : null,
      }))

    if (!investors.length) {
      console.log(`  ↳ No valid rows`)
      continue
    }

    // Upsert by name+category to avoid duplicates on re-run
    const { data, error } = await supabase
      .from('investors')
      .upsert(investors, { onConflict: 'name,category', ignoreDuplicates: false })
      .select('id')

    if (error) {
      console.error(`  ✗ Error: ${error.message}`)
      results.errors += investors.length
    } else {
      console.log(`  ✓ Upserted ${data?.length ?? 0} investors`)
      results.inserted += data?.length ?? 0
    }
  }

  console.log('\n─────────────────────────────────')
  console.log(`✅ Done: ${results.inserted} inserted, ${results.skipped} skipped, ${results.errors} errors`)
}

const file = process.argv[2] ?? path.join(process.cwd(), 'data', 'Список_инвесторов_ALHENA_VC.xlsx')
seed(file).catch((e) => { console.error(e); process.exit(1) })
