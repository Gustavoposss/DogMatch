#!/usr/bin/env ts-node

/**
 * 🧪 SCRIPT MASTER DE TESTES
 * 
 * Este script executa todos os testes do sistema e gera um relatório completo.
 * 
 * Uso:
 *   npm run test:all
 *   ou
 *   ts-node tests/run-all-tests.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.cyan + colors.bright);
  console.log('='.repeat(60) + '\n');
}

async function runTests() {
  const startTime = Date.now();
  
  logSection('🧪 INICIANDO TESTES COMPLETOS DO SISTEMA PAR DE PATAS');
  
  log('📋 Verificando configuração...', colors.blue);
  
  // Verificar se Jest está instalado
  try {
    execSync('npx jest --version', { stdio: 'ignore' });
  } catch (error) {
    log('❌ Jest não encontrado. Instalando dependências...', colors.yellow);
    execSync('npm install', { stdio: 'inherit' });
  }

  log('✅ Configuração OK\n', colors.green);

  // Executar testes
  logSection('🚀 EXECUTANDO TESTES');
  
  try {
    log('Executando todos os testes...', colors.blue);
    execSync('npx jest --runInBand --detectOpenHandles --verbose', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    logSection('✅ TODOS OS TESTES PASSARAM!');
    log(`⏱️  Tempo total: ${duration}s`, colors.green);
    log('\n🎉 Sistema validado e pronto para produção!', colors.green + colors.bright);
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    logSection('❌ ALGUNS TESTES FALHARAM');
    log(`⏱️  Tempo total: ${duration}s`, colors.red);
    log('\n⚠️  Revise os erros acima antes de fazer o build.', colors.yellow);
    process.exit(1);
  }
}

// Executar
runTests().catch((error) => {
  log('❌ Erro ao executar testes:', colors.red);
  console.error(error);
  process.exit(1);
});

