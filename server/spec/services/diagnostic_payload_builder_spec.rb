require 'rails_helper'

RSpec.describe DiagnosticPayloadBuilder do
  describe '#call' do
    context 'with default arguments' do
      let(:deficits) { [build(:handling_deficit)] }
      let(:result) do
        described_class.new(
          car_data: 'car xml',
          track_data: 'track xml',
          handling_deficits: deficits
        ).call
      end
      let(:content) { result[:messages].first[:content] }

      it 'uses default model, max_tokens, effort, and system rules' do
        expect(result[:model]).to eq(described_class::DEFAULT_ANTHROPIC_MODEL)
        expect(result[:max_tokens]).to eq(described_class::DEFAULT_MAX_TOKENS)
        expect(result[:effort]).to eq(described_class::DEFAULT_EFFORT)
        expect(result[:system]).to eq(described_class::DEFAULT_SYSTEM_RULES)
      end

      it 'returns a single user message with three content blocks' do
        expect(result[:messages].size).to eq(1)
        expect(result[:messages].first[:role]).to eq('user')
        expect(content.size).to eq(3)
      end

      it 'wraps car_data in an ephemeral-cached text block' do
        expect(content[0]).to eq(
          type: 'text',
          text: "<car_data>\ncar xml\n</car_data>",
          cache_control: { type: 'ephemeral' }
        )
      end

      it 'wraps track_data in an ephemeral-cached text block' do
        expect(content[1]).to eq(
          type: 'text',
          text: "<track_data>\ntrack xml\n</track_data>",
          cache_control: { type: 'ephemeral' }
        )
      end

      it 'wraps handling_deficits in an ephemeral-cached text block' do
        expect(content[2][:type]).to eq('text')
        expect(content[2][:cache_control]).to eq({ type: 'ephemeral' })
        expect(content[2][:text]).to start_with("<handling_deficits>\n")
        expect(content[2][:text]).to end_with("\n</handling_deficits>")
      end
    end

    it 'allows overriding model and system_rules' do
      result = described_class.new(
        model: 'custom-model',
        system_rules: 'custom rules'
      ).call

      expect(result[:model]).to eq('custom-model')
      expect(result[:system]).to eq('custom rules')
      expect(result[:max_tokens]).to eq(described_class::DEFAULT_MAX_TOKENS)
      expect(result[:effort]).to eq(described_class::DEFAULT_EFFORT)
    end
  end
end
