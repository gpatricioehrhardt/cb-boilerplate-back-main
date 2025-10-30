import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 1. Criar Perfis de Custo
  console.log('📊 Criando perfis de custo...');
  const perfilJunior = await prisma.perfilDeCusto.create({
    data: {
      nome: 'Desenvolvedor Júnior',
      custoHora: 50.00,
    },
  });

  const perfilPleno = await prisma.perfilDeCusto.create({
    data: {
      nome: 'Desenvolvedor Pleno',
      custoHora: 75.00,
    },
  });

  const perfilSenior = await prisma.perfilDeCusto.create({
    data: {
      nome: 'Desenvolvedor Sênior',
      custoHora: 100.00,
    },
  });

  console.log('✅ Perfis de custo criados:', { perfilJunior, perfilPleno, perfilSenior });

  // 2. Criar Usuários
  console.log('👥 Criando usuários...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Sistema',
      email: 'admin@sistema.com',
      password: await bcrypt.hash('123456', 10),
      perfil: 'ADMIN',
      perfilDeCustoId: perfilSenior.id,
      custoHora: 100.00,
    },
  });

  const gestor = await prisma.user.create({
    data: {
      name: 'João Gestor',
      email: 'joao@sistema.com',
      password: await bcrypt.hash('123456', 10),
      perfil: 'GESTOR',
      perfilDeCustoId: perfilPleno.id,
      custoHora: 75.00,
    },
  });

  const colaborador1 = await prisma.user.create({
    data: {
      name: 'Maria Desenvolvedora',
      email: 'maria@sistema.com',
      password: await bcrypt.hash('123456', 10),
      perfil: 'COLABORADOR',
      perfilDeCustoId: perfilJunior.id,
      custoHora: 50.00,
    },
  });

  const colaborador2 = await prisma.user.create({
    data: {
      name: 'Pedro Desenvolvedor',
      email: 'pedro@sistema.com',
      password: await bcrypt.hash('123456', 10),
      perfil: 'COLABORADOR',
      perfilDeCustoId: perfilPleno.id,
      custoHora: 75.00,
    },
  });

  console.log('✅ Usuários criados:', { admin, gestor, colaborador1, colaborador2 });

  // 3. Criar Projetos
  console.log('📁 Criando projetos...');
  
  // Projeto Escopo Fechado
  const projetoEscopoFechado = await prisma.projeto.create({
    data: {
      nome: 'Sistema de Vendas Online',
      cliente: 'Empresa ABC Ltda',
      centroCusto: 'CC001',
      status: 'ATIVO',
      billingModel: 'ESCOPO_FECHADO',
      feeTipo: 'FIXO',
      feeValor: 50000.00,
      gestorId: gestor.id,
    },
  });

  // Projeto Alocação
  const projetoAlocacao = await prisma.projeto.create({
    data: {
      nome: 'Suporte Técnico Mensal',
      cliente: 'Empresa XYZ Ltda',
      centroCusto: 'CC002',
      status: 'ATIVO',
      billingModel: 'ALOCACAO',
      gestorId: gestor.id,
    },
  });

  console.log('✅ Projetos criados:', { projetoEscopoFechado, projetoAlocacao });

  // 4. Criar Estimativas para Escopo Fechado
  console.log('📈 Criando estimativas para projeto escopo fechado...');
  await prisma.projetoEstimativaPerfil.createMany({
    data: [
      {
        projetoId: projetoEscopoFechado.id,
        perfilDeCustoId: perfilSenior.id,
        horasEstimadas: 100.00,
        custoHoraSnapshot: 100.00,
        precoHoraSnapshot: 150.00,
      },
      {
        projetoId: projetoEscopoFechado.id,
        perfilDeCustoId: perfilPleno.id,
        horasEstimadas: 200.00,
        custoHoraSnapshot: 75.00,
        precoHoraSnapshot: 120.00,
      },
      {
        projetoId: projetoEscopoFechado.id,
        perfilDeCustoId: perfilJunior.id,
        horasEstimadas: 150.00,
        custoHoraSnapshot: 50.00,
        precoHoraSnapshot: 80.00,
      },
    ],
  });

  // 5. Criar Contratos para Alocação
  console.log('📋 Criando contratos para projeto alocação...');
  await prisma.projetoContratoMensalPerfil.createMany({
    data: [
      {
        projetoId: projetoAlocacao.id,
        mesCompetencia: '2024-01',
        perfilDeCustoId: perfilPleno.id,
        horasContratadasMes: 160.00,
        precoHoraContratada: 120.00,
        precoHoraAdicional: 150.00,
        precoHoraForaHorario: 180.00,
        precoHoraExtra: 200.00,
        custoHoraSnapshot: 75.00,
      },
      {
        projetoId: projetoAlocacao.id,
        mesCompetencia: '2024-01',
        perfilDeCustoId: perfilJunior.id,
        horasContratadasMes: 80.00,
        precoHoraContratada: 80.00,
        precoHoraAdicional: 100.00,
        precoHoraForaHorario: 120.00,
        precoHoraExtra: 140.00,
        custoHoraSnapshot: 50.00,
      },
    ],
  });

  // 6. Criar Parcelas para Escopo Fechado
  console.log('💰 Criando parcelas para projeto escopo fechado...');
  await prisma.projetoFeeParcela.createMany({
    data: [
      {
        projetoId: projetoEscopoFechado.id,
        tipoParcela: 'MARCO',
        descricaoMarco: 'Entrega da API',
        vencimento: new Date('2024-02-15'),
        valor: 25000.00,
      },
      {
        projetoId: projetoEscopoFechado.id,
        tipoParcela: 'MARCO',
        descricaoMarco: 'Entrega Final',
        vencimento: new Date('2024-03-15'),
        valor: 25000.00,
      },
    ],
  });

  // 7. Criar Tarefas
  console.log('📝 Criando tarefas...');
  await prisma.tarefa.createMany({
    data: [
      {
        projetoId: projetoEscopoFechado.id,
        nome: 'Desenvolvimento da API REST',
        orcamentoHoras: 100.00,
      },
      {
        projetoId: projetoEscopoFechado.id,
        nome: 'Desenvolvimento do Frontend',
        orcamentoHoras: 150.00,
      },
      {
        projetoId: projetoEscopoFechado.id,
        nome: 'Testes e Deploy',
        orcamentoHoras: 50.00,
      },
      {
        projetoId: projetoAlocacao.id,
        nome: 'Suporte Técnico Geral',
        orcamentoHoras: 160.00,
      },
      {
        projetoId: projetoAlocacao.id,
        nome: 'Desenvolvimento de Melhorias',
        orcamentoHoras: 80.00,
      },
    ],
  });

  // 8. Criar Alocações
  console.log('👤 Criando alocações...');
  await prisma.alocacao.createMany({
    data: [
      {
        userId: colaborador1.id,
        projetoId: projetoEscopoFechado.id,
        tarefaId: 1, // API REST
        dtInicio: new Date('2024-01-01'),
        ativo: true,
      },
      {
        userId: colaborador2.id,
        projetoId: projetoEscopoFechado.id,
        tarefaId: 2, // Frontend
        dtInicio: new Date('2024-01-01'),
        ativo: true,
      },
      {
        userId: colaborador1.id,
        projetoId: projetoAlocacao.id,
        tarefaId: 4, // Suporte Geral
        dtInicio: new Date('2024-01-01'),
        ativo: true,
      },
    ],
  });

  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('📊 Resumo dos dados criados:');
  console.log('- 3 Perfis de Custo');
  console.log('- 4 Usuários (1 Admin, 1 Gestor, 2 Colaboradores)');
  console.log('- 2 Projetos (1 Escopo Fechado, 1 Alocação)');
  console.log('- 3 Estimativas de Perfil');
  console.log('- 2 Contratos Mensais');
  console.log('- 2 Parcelas de Fee');
  console.log('- 5 Tarefas');
  console.log('- 3 Alocações');
  console.log('');
  console.log('🔑 Credenciais de teste:');
  console.log('Admin: admin@sistema.com / 123456');
  console.log('Gestor: joao@sistema.com / 123456');
  console.log('Colaborador: maria@sistema.com / 123456');
  console.log('Colaborador: pedro@sistema.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



