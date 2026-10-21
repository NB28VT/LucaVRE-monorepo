require "rails_helper"

RSpec.describe MockAnthropicSdkService do
  describe "#generate_response" do
    let(:response) do
      described_class.new.generate_response(
        system_rules: "assembled system rules",
        messages: [],
        output_format: DiagnosticService::OUTPUT_SCHEMA
      )
    end

    it "returns parsed_output keys and values that belong to OUTPUT_SCHEMA" do
      properties = DiagnosticService::OUTPUT_SCHEMA[:properties]

      response.parsed_output.each do |key, value|
        property = properties.fetch(key.to_sym)
        expect(property[:enum]).to include(value)
      end
    end
  end
end
