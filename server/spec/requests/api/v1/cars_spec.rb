require 'rails_helper'

RSpec.describe "Cars API", type: :request do
  describe "GET /api/v1/cars" do
    it "returns all cars with slug ids and names" do
      get "/api/v1/cars"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body.size).to eq(Car.all.size)
      expect(body.first.keys).to match_array(%w[id name])
      expect(body).to include(
        { "id" => "porsche_911_lmgt3_r_992", "name" => "Porsche 911 LMGT3 R (992)" }
      )
    end
  end
end
