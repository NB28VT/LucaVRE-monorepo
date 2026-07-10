class AnthropicSdkService
    def initialize
        @anthropic = Anthropic::Client.new(
            api_key: Rails.application.credentials.dig(:anthropic, :api_key)
        )
    end

    def generate_response(prompt:)
        response = @anthropic.messages.create(
            max_tokens: 1024,
            messages: [{role: "user", content: prompt}],
            # Start with cheapest model:
             model: "claude-haiku-4-5-20251001"
            #  Later, use the most powerful model:
            # model: "claude-opus-4-6"
        )
        return response.content
    end
end
