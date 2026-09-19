class DiagnosticLog < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions

  belongs_to :working_session
  belongs_to_active_hash :track
  belongs_to_active_hash :car
  has_and_belongs_to_many :handling_deficits

  validates :track_id, presence: true
  validates :car_id, presence: true
end
