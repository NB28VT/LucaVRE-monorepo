class WorkingSession < ApplicationRecord
    extend ActiveHash::Associations::ActiveRecordExtensions

    has_many :handling_deficits, dependent: :destroy
    has_many :diagnostic_logs, dependent: :destroy

    belongs_to_active_hash :track
    belongs_to_active_hash :car

    validates :track_id, presence: true
    validates :car_id, presence: true
end
