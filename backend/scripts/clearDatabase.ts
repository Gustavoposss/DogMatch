import prisma from '../prismaClient';

/**
 * Script para limpar TODOS os dados do banco de dados
 * ⚠️ ATENÇÃO: Este script apaga TODOS os dados permanentemente!
 * Use apenas em desenvolvimento ou antes de ir para produção
 */
async function clearDatabase() {
  try {
    console.log('🧹 Iniciando limpeza do banco de dados...\n');

    // A ordem é importante por causa das foreign keys
    // Deletar na ordem inversa das dependências

    console.log('🗑️  Deletando mensagens...');
    const messages = await prisma.message.deleteMany({});
    console.log(`   ✅ ${messages.count} mensagens deletadas`);

    console.log('🗑️  Deletando chats...');
    const chats = await prisma.chat.deleteMany({});
    console.log(`   ✅ ${chats.count} chats deletados`);

    console.log('🗑️  Deletando matches...');
    const matches = await prisma.match.deleteMany({});
    console.log(`   ✅ ${matches.count} matches deletados`);

    console.log('🗑️  Deletando likes...');
    const likes = await prisma.like.deleteMany({});
    console.log(`   ✅ ${likes.count} likes deletados`);

    console.log('🗑️  Deletando boosts...');
    const boosts = await prisma.boost.deleteMany({});
    console.log(`   ✅ ${boosts.count} boosts deletados`);

    console.log('🗑️  Deletando pagamentos...');
    const payments = await prisma.payment.deleteMany({});
    console.log(`   ✅ ${payments.count} pagamentos deletados`);

    console.log('🗑️  Deletando limites de uso...');
    const usageLimits = await prisma.usageLimit.deleteMany({});
    console.log(`   ✅ ${usageLimits.count} limites de uso deletados`);

    console.log('🗑️  Deletando assinaturas...');
    const subscriptions = await prisma.subscription.deleteMany({});
    console.log(`   ✅ ${subscriptions.count} assinaturas deletadas`);

    console.log('🗑️  Deletando pets...');
    const pets = await prisma.pet.deleteMany({});
    console.log(`   ✅ ${pets.count} pets deletados`);

    console.log('🗑️  Deletando usuários...');
    const users = await prisma.user.deleteMany({});
    console.log(`   ✅ ${users.count} usuários deletados`);

    console.log('\n✨ Banco de dados limpo com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - ${users.count} usuários`);
    console.log(`   - ${pets.count} pets`);
    console.log(`   - ${subscriptions.count} assinaturas`);
    console.log(`   - ${usageLimits.count} limites de uso`);
    console.log(`   - ${payments.count} pagamentos`);
    console.log(`   - ${boosts.count} boosts`);
    console.log(`   - ${likes.count} likes`);
    console.log(`   - ${matches.count} matches`);
    console.log(`   - ${chats.count} chats`);
    console.log(`   - ${messages.count} mensagens`);

  } catch (error) {
    console.error('❌ Erro ao limpar banco de dados:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  console.log('⚠️  ATENÇÃO: Você está prestes a DELETAR TODOS os dados do banco!');
  console.log('⚠️  Esta ação é IRREVERSÍVEL!');
  console.log('⚠️  Certifique-se de que está no ambiente correto!\n');
  
  // Verificar se está em produção
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERRO: Não é possível limpar o banco em produção!');
    console.error('❌ Defina NODE_ENV=development para executar este script.\n');
    process.exit(1);
  }
  
  console.log('⏳ Iniciando limpeza em 2 segundos...');
  console.log('   (Pressione Ctrl+C para cancelar)\n');
  
  // Executar após 2 segundos para dar tempo de cancelar (Ctrl+C)
  setTimeout(() => {
    clearDatabase()
      .then(() => {
        console.log('\n✅ Processo concluído!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Erro:', error);
        process.exit(1);
      });
  }, 2000);
}

export default clearDatabase;

