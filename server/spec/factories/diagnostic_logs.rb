FactoryBot.define do
  factory :diagnostic_log do
    working_session
    car_id { working_session&.car_id || Faker::Alphanumeric.alpha(number: 10) }
    track_id { working_session&.track_id || Faker::Alphanumeric.alpha(number: 10) }
    recommendations { { "rear_wing" => 8 } }
    thought_process { "Summary of setup reasoning." }
  end
end
