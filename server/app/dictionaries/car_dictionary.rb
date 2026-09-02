module Dictionaries
    module CarDictionary
      CAR_KEY_MAPPING = {
        "engine_placement" => "ep",
        "aero_platform"    => "ap",
        "wheelbase"        => "wb",
        "primary_quirk"    => "pq"
      }.freeze
  
      ENGINE_PLACEMENT_MAPPING = {
        "front_engine_rear_wheel_drive" => "fr",
        "mid_engine_rear_wheel_drive" => "mr",
        "rear_engine_rear_wheel_drive" => "rr"
      }.freeze
  
      AERO_PLATFORM_MAPPING = {
        "pitch_sensitive" => "ps",
        "aero_stable" => "as"
      }.freeze
  
      WHEELBASE_MAPPING = {
        "short" => "sh",
        "long" => "lg"
      }.freeze
  
      PRIMARY_QUIRK_MAPPING = {
        "lift_off_oversteer" => "loo",
        "entry_understeer" => "eus",
        "power_on_understeer" => "pus",
        "snap_oversteer" => "nos",
        "curb_instability" => "cus",
        "understeer_on_corner_entry" => "uce",
        "predictable_slider_traits" => "pst",
        "forgiving_over_bumps" => "fob",
        "stable_yaw_rate" => "syr",
        "fast_rotation" => "fro",
        "snappy_at_the_limit" => "sal",
        "moderate_yaw_rate" => "myr",
        "sharp_loss_of_front_grip_under_acceleration" => "sfg",
        "severe_oversteer_if_rear_drops" => "sod",
        "highly_agile" => "hag",
        "unsettled_by_curbs" => "ubc",
        "incredible_acceleration_traction" => "iat",
        "prone_to_front_end_lift" => "fel",
        "pendulum_effects" => "pde"
      }.freeze
  end
end
