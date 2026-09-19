class HandlingDeficit < ApplicationRecord
  belongs_to :working_session
  has_and_belongs_to_many :diagnostic_logs

  validates :location, presence: true, inclusion: { in: %w[global high_speed mid_speed low_speed] }
  validates :symptom, presence: true, inclusion: { in: %w[oversteer understeer] }

  validates :phase, presence: true, inclusion: { in: %w[entry mid_corner exit] }, unless: -> { location == 'global' }
  validates :phase, absence: true, if: -> { location == 'global' }
  validates :phase, uniqueness: { scope: [:working_session_id, :location] }
end
