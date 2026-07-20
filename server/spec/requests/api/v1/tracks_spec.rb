require 'rails_helper'

RSpec.describe "Tracks API", type: :request do
  describe "GET /api/v1/tracks" do
    it "returns all tracks with slug ids and names" do
      get "/api/v1/tracks"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body.size).to eq(Track.all.size)
      expect(body.first.keys).to match_array(%w[id name])
      expect(body).to include(
        { "id" => "spa_francorchamps_gp", "name" => "Spa-Francorchamps - Grand Prix" }
      )
    end
  end
end
