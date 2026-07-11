FactoryBot.define do
  factory :handling_deficit do
    working_session
    location { 'trackwide' }
    deficit { 'oversteer' }
  end
end
