class MockAnthropicSdkService
  PARSED_OUTPUT = {
    "front_arb" => 5,
    "tire_pressures" => 145,
    "brake_bias" => 52.0
  }.freeze

  THOUGHT_PROCESS = "Hold the current balance and set the listed garage targets.".freeze

  Response = Struct.new(:parsed_output, :content, keyword_init: true)
  ThinkingBlock = Struct.new(:type, :thinking, keyword_init: true)

  def generate_response(system_rules:, messages:, output_format:)
    Response.new(
      parsed_output: PARSED_OUTPUT,
      content: [ ThinkingBlock.new(type: :thinking, thinking: THOUGHT_PROCESS) ]
    )
  end
end
