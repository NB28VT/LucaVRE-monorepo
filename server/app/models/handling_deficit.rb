class HandlingDeficit < ApplicationRecord
  belongs_to :working_session

  validates :location, presence: true, inclusion: { in: %w[trackwide] }
  validates :deficit, presence: true, inclusion: { in: %w[oversteer understeer balanced] }
end
