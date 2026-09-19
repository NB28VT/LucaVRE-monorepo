require "rails_helper"

RSpec.describe DiagnosticLog, type: :model do
  describe "validations" do
    it "is valid with a working session, car_id, and track_id" do
      diagnostic_log = build(:diagnostic_log)

      expect(diagnostic_log).to be_valid
    end

    it "is invalid without a working session" do
      diagnostic_log = build(:diagnostic_log, working_session: nil)

      expect(diagnostic_log).not_to be_valid
      expect(diagnostic_log.errors[:working_session]).to include("must exist")
    end

    it "is invalid without a car_id" do
      diagnostic_log = build(:diagnostic_log, car_id: nil)

      expect(diagnostic_log).not_to be_valid
      expect(diagnostic_log.errors[:car_id]).to include("can't be blank")
    end

    it "is invalid without a track_id" do
      diagnostic_log = build(:diagnostic_log, track_id: nil)

      expect(diagnostic_log).not_to be_valid
      expect(diagnostic_log.errors[:track_id]).to include("can't be blank")
    end
  end

  describe "associations" do
    it "belongs to a working session" do
      working_session = build(:working_session)
      diagnostic_log = build(:diagnostic_log, working_session: working_session)

      expect(diagnostic_log.working_session).to eq(working_session)
    end

    it "associates handling deficits through the join table" do
      working_session = create(:working_session)
      handling_deficit = create(:handling_deficit, working_session: working_session)
      diagnostic_log = create(:diagnostic_log, working_session: working_session)

      diagnostic_log.handling_deficits << handling_deficit

      expect(diagnostic_log.reload.handling_deficits).to eq([handling_deficit])
    end
  end
end
