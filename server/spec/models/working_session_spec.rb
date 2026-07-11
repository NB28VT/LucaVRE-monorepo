require 'rails_helper'

RSpec.describe WorkingSession, type: :model do
  describe 'validations' do
    it 'is valid with a car_id and track_id' do
      working_session = build(:working_session)

      expect(working_session).to be_valid
    end

    it 'is invalid without a car_id' do
      working_session = build(:working_session, car_id: nil)

      expect(working_session).not_to be_valid
      expect(working_session.errors[:car_id]).to include("can't be blank")
    end

    it 'is invalid without a track_id' do
      working_session = build(:working_session, track_id: nil)

      expect(working_session).not_to be_valid
      expect(working_session.errors[:track_id]).to include("can't be blank")
    end
  end
end
