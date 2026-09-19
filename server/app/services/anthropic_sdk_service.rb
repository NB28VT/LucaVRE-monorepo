class AnthropicSdkService
  DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5"
  DEFAULT_MAX_TOKENS = 16000
  DEFAULT_EFFORT = "high"
  DEFAULT_THINKING = { type: :adaptive, display: :summarized }.freeze

  def initialize(client: Anthropic::Client.new(api_key: Rails.application.credentials.dig(:anthropic, :api_key)))
    @client = client
  end

  def generate_response(system_rules:, messages:, output_format: nil)
    @client.messages.create(
      model: DEFAULT_ANTHROPIC_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      thinking: DEFAULT_THINKING,
      output_config: output_config(output_format),
      system_: [
        {
          type: "text",
          text: system_rules,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: messages
    )
  end

  private

  def output_config(output_format)
    config = { effort: DEFAULT_EFFORT }
    return config if output_format.nil?

    config.merge(format: { type: :json_schema, schema: output_format })
  end
end
