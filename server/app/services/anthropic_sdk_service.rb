class AnthropicSdkService
  DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5"
  DEFAULT_MAX_TOKENS = 1500
  DEFAULT_EFFORT = "high"

  def initialize(client: Anthropic::Client.new(api_key: Rails.application.credentials.dig(:anthropic, :api_key)))
    @client = client
  end

  def generate_response(system_rules:, messages:)
    @client.messages.create(
      model: DEFAULT_ANTHROPIC_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      output_config: { effort: DEFAULT_EFFORT },
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
end
