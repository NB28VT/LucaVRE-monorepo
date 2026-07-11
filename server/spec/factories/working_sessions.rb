FactoryBot.define do
  factory :working_session do
    track_id { Faker::Alphanumeric.alpha(number: 10) }
    car_id { Faker::Alphanumeric.alpha(number: 10) }
  end
end
