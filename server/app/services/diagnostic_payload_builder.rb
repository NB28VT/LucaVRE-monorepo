class DiagnosticPayloadBuilder
    DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5" # The sweet-spot model for hobby app data parsing
    DEFAULT_MAX_TOKENS = 1500 # Higher token pool to accommodate native JSON generation
    DEFAULT_EFFORT = "high" # Toggles Claude's reasoning loops to avoid math/physics hallucinations

    # TODO: This will read from a file in the config folder
    DEFAULT_SYSTEM_RULES = ""

    HANDLING_DEFICIT_LOCATION_MAPPING = {
        "high_speed" => "hi_spd",
        "mid_speed" => "med_spd",
        "low_speed" => "lo_spd",
        "global" => "glbl"
    }.freeze

    HANDLING_DEFICIT_PHASE_MAPPING = {
        "entry" => "entry",
        "mid_corner" => "mid",
        "exit" => "exit"
    }.freeze

    HANDLING_DEFICIT_SYMPTOM_MAPPING = {
        "understeer" => "us",
        "oversteer" => "os"
    }.freeze

    def initialize(model: DEFAULT_ANTHROPIC_MODEL, system_rules: DEFAULT_SYSTEM_RULES, car_data: "", track_data: "", handling_deficits: [])
        @system_rules = system_rules
        @car_data = car_data
        @track_data = track_data
        @handling_deficits = handling_deficits
        @model = model
    end

    def call
        messages_content = [
            {
                type: "text",
                text: "<car_data>\n#{@car_data}\n</car_data>",
                cache_control: { type: "ephemeral" } # First Cache Point
            },
            {
                type: "text",
                text: "<track_data>\n#{@track_data}\n</track_data>",
                cache_control: { type: "ephemeral" } # Second Cache Point
            },
            {
                type: "text",
                text: "<handling_deficits>\n#{build_handling_deficits}\n</handling_deficits>",
                cache_control: { type: "ephemeral" } # Third Cache Point
            }
        ]

        {
            model: @model,
            max_tokens:  DEFAULT_MAX_TOKENS,
            effort: DEFAULT_EFFORT,
            system: @system_rules,
            messages: [
                role: "user",
                content: messages_content
            ]
        }
    end

    private

    def build_handling_deficits
        @handling_deficits.map do |handling_deficit|
            parts = [
                "loc:#{HANDLING_DEFICIT_LOCATION_MAPPING[handling_deficit.location]}",
                ("phase:#{HANDLING_DEFICIT_PHASE_MAPPING[handling_deficit.phase]}" if handling_deficit.phase.present?),
                "sym:#{HANDLING_DEFICIT_SYMPTOM_MAPPING[handling_deficit.symptom]}"
            ].compact

            "<handling_deficit>#{parts.join(';')}</handling_deficit>"
        end.join("\n")
    end
end