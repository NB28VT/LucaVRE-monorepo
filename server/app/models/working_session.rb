class WorkingSession < ApplicationRecord
    has_many :handling_deficits, dependent: :destroy

    validates :track_id, presence: true
    validates :car_id, presence: true
end
