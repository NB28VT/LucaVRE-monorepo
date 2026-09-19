require "rails_helper"

RSpec.describe AnthropicSdkService do
  describe "#generate_response" do
    let(:client) { instance_double(Anthropic::Client) }
    let(:messages_resource) { instance_double(Anthropic::Resources::Messages) }
    let(:sdk_response) { instance_double(Anthropic::Models::Message) }
    let(:system_rules) { "assembled system rules" }
    let(:messages) { [{ role: "user", content: "hello" }] }
    let(:service) { described_class.new(client: client) }

    before do
      allow(client).to receive(:messages).and_return(messages_resource)
      allow(messages_resource).to receive(:create).and_return(sdk_response)
    end

    def generate
      service.generate_response(system_rules: system_rules, messages: messages)
    end

    it "uses the default model, max_tokens, and effort" do
      generate

      expect(messages_resource).to have_received(:create).with(
        hash_including(
          model: described_class::DEFAULT_ANTHROPIC_MODEL,
          max_tokens: described_class::DEFAULT_MAX_TOKENS,
          output_config: { effort: described_class::DEFAULT_EFFORT }
        )
      )
    end

    it "passes system_rules through as a cached system text block" do
      generate

      expect(messages_resource).to have_received(:create).with(
        hash_including(
          system_: [
            {
              type: "text",
              text: system_rules,
              cache_control: { type: "ephemeral" }
            }
          ]
        )
      )
    end

    it "passes messages through unchanged" do
      generate

      expect(messages_resource).to have_received(:create).with(
        hash_including(messages: messages)
      )
    end

    it "returns the SDK response" do
      expect(generate).to eq(sdk_response)
    end
  end
end
