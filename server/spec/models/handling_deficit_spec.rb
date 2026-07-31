require 'rails_helper'

RSpec.describe HandlingDeficit, type: :model do
  describe 'validations' do
    it 'is valid with a location and symptom' do
      handling_deficit = build(:handling_deficit)

      expect(handling_deficit).to be_valid
    end

    it 'is invalid without a location' do
      handling_deficit = build(:handling_deficit, location: nil)

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:location]).to include("can't be blank")
    end

    it 'is invalid without a symptom' do
      handling_deficit = build(:handling_deficit, symptom: nil)

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:symptom]).to include("can't be blank")
    end

    it 'is invalid with a location not in the allowed list' do
      handling_deficit = build(:handling_deficit, location: 'front')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:location]).to include('is not included in the list')
    end

    it 'is valid with a location of global and no phase' do
      handling_deficit = build(:handling_deficit, location: 'global', phase: nil)

      expect(handling_deficit).to be_valid
    end

    %w[high_speed mid_speed low_speed].each do |valid_location|
      it "is valid with a location of #{valid_location} and a phase" do
        handling_deficit = build(:handling_deficit, location: valid_location, phase: 'entry')

        expect(handling_deficit).to be_valid
      end
    end

    it 'is invalid with a second global handling deficit for the same working session' do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: 'global')
      handling_deficit = build(:handling_deficit, working_session: working_session, location: 'global')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:phase]).to include('has already been taken')
    end

    it 'is valid with the same location for a different working session' do
      create(:handling_deficit, location: 'global')
      handling_deficit = build(:handling_deficit, location: 'global')

      expect(handling_deficit).to be_valid
    end

    it 'is valid with a different location for the same working session' do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: 'global')
      handling_deficit = build(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'entry')

      expect(handling_deficit).to be_valid
    end

    it 'is invalid without a phase when the location is not global' do
      handling_deficit = build(:handling_deficit, location: 'high_speed', phase: nil)

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:phase]).to include("can't be blank")
    end

    it 'is invalid with a phase when the location is global' do
      handling_deficit = build(:handling_deficit, location: 'global', phase: 'entry')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:phase]).to include('must be blank')
    end

    it 'is invalid with a phase not in the allowed list' do
      handling_deficit = build(:handling_deficit, location: 'high_speed', phase: 'apex')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:phase]).to include('is not included in the list')
    end

    %w[entry mid_corner exit].each do |valid_phase|
      it "is valid with a phase of #{valid_phase} for a non-global location" do
        handling_deficit = build(:handling_deficit, location: 'high_speed', phase: valid_phase)

        expect(handling_deficit).to be_valid
      end
    end

    it 'is invalid with a location and phase already used for the same working session' do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'entry')
      handling_deficit = build(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'entry')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:phase]).to include('has already been taken')
    end

    it 'is valid with the same location and a different phase for the same working session' do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'entry')
      handling_deficit = build(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'mid_corner')

      expect(handling_deficit).to be_valid
    end

    it 'is valid with the same location and phase for a different working session' do
      create(:handling_deficit, location: 'high_speed', phase: 'entry')
      handling_deficit = build(:handling_deficit, location: 'high_speed', phase: 'entry')

      expect(handling_deficit).to be_valid
    end

    it 'is invalid with a symptom other than oversteer or understeer' do
      handling_deficit = build(:handling_deficit, symptom: 'wobbly')

      expect(handling_deficit).not_to be_valid
      expect(handling_deficit.errors[:symptom]).to include('is not included in the list')
    end

    %w[oversteer understeer].each do |valid_symptom|
      it "is valid with a symptom of #{valid_symptom}" do
        handling_deficit = build(:handling_deficit, symptom: valid_symptom)

        expect(handling_deficit).to be_valid
      end
    end
  end
end
