#!/bin/bash

# Script para configurar variáveis de ambiente na Vercel

echo "🔧 Configurando variáveis de ambiente na Vercel..."

# Remover variáveis existentes (se houver)
echo "Removendo variáveis existentes..."
npx vercel env rm VITE_SUPABASE_URL production --yes 2>/dev/null || true
npx vercel env rm VITE_SUPABASE_ANON_KEY production --yes 2>/dev/null || true

# Adicionar variáveis para produção
echo "Adicionando VITE_SUPABASE_URL..."
echo "https://heyzkjilmszhhvgocwjz.supabase.co" | npx vercel env add VITE_SUPABASE_URL production

echo "Adicionando VITE_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU" | npx vercel env add VITE_SUPABASE_ANON_KEY production

# Adicionar para preview também
echo "Adicionando para preview..."
echo "https://heyzkjilmszhhvgocwjz.supabase.co" | npx vercel env add VITE_SUPABASE_URL preview
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU" | npx vercel env add VITE_SUPABASE_ANON_KEY preview

# Adicionar para development
echo "Adicionando para development..."
echo "https://heyzkjilmszhhvgocwjz.supabase.co" | npx vercel env add VITE_SUPABASE_URL development
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU" | npx vercel env add VITE_SUPABASE_ANON_KEY development

echo "✅ Variáveis configuradas! Fazendo redeploy..."
npx vercel --prod

echo "🎉 Deploy concluído!"
