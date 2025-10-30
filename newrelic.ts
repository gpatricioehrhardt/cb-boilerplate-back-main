export const config = {
  app_name: [process.env.NEW_RELIC_APP_NAME], // Nome da aplicação
  license_key: process.env.NEW_RELIC_LICENSE_KEY, // Substitua pela sua chave de licença
  /**
   * Configurações de logging.
   */
  logging: {
    /**
     * Nível de log. Pode ser um dos seguintes:
     * 'error', 'warn', 'info', 'debug', 'trace'.
     */
    level: 'trace',

    /**
     * Caminho para salvar os logs (opcional).
     */
    filepath: 'stdout',
  },

  /**
   * Habilita ou desabilita o tracing distribuído.
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Configurações de métricas personalizadas.
   */
  custom_insights_events: {
    enabled: true,
  },

  /**
   * Configurações de transações.
   */
  transaction_tracer: {
    /**
     * Habilita ou desabilita o rastreamento de transações.
     */
    enabled: true,

    /**
     * Limite de tempo (em segundos) para capturar transações lentas.
     */
    transaction_threshold: 'apdex_f',

    /**
     * Número máximo de segmentos detalhados por transação.
     */
    top_n: 20,
  },

  /**
   * Configurações de erro.
   */
  error_collector: {
    /**
     * Habilita ou desabilita a coleta de erros.
     */
    enabled: true,

    /**
     * Lista de códigos de status HTTP a serem ignorados.
     */
    ignore_status_codes: [404, 401],
  },

  /**
   * Configurações de rastreamento de mensagens.
   */
  message_tracer: {
    /**
     * Habilita ou desabilita o rastreamento de mensagens.
     */
    segment_parameters: {
      enabled: true,
    },
  },

  /**
   * Configurações de eventos de transações.
   */
  transaction_events: {
    /**
     * Habilita ou desabilita a coleta de eventos de transações.
     */
    enabled: true,

    /**
     * Número máximo de eventos armazenados por minuto.
     */
    max_samples_stored: 2000,
  },

  /**
   * Configurações de métricas de alta segurança.
   */
  high_security: false,

  /**
   * Configurações de atributos.
   */
  attributes: {
    /**
     * Habilita ou desabilita a coleta de atributos.
     */
    enabled: true,

    /**
     * Lista de atributos incluídos.
     */
    include: ['request.parameters.*'],

    /**
     * Lista de atributos excluídos.
     */
    exclude: ['response.headers.*', 'request.headers.cookie'],
  },

  /**
   * Configurações de métricas de SQL.
   */
  slow_sql: {
    /**
     * Habilita ou desabilita a coleta de métricas de SQL lento.
     */
    enabled: true,

    /**
     * Limite de tempo (em milissegundos) para considerar uma query como lenta.
     */
    max_samples: 10,
  },

  /**
   * Configurações de segurança.
   */
  security_policies_token: '',

  /**
   * Configurações de métricas de memória.
   */
  process_host: {
    display_name: 'nestjs-sample-host',
  },

  /**
   * Configurações de métricas de conectividade.
   */
  utilization: {
    detect_aws: true,
    detect_azure: true,
    detect_gcp: true,
    detect_pcf: true,
    detect_docker: true,
  },
};
