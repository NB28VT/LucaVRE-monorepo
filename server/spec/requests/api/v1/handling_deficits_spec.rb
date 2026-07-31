require 'rails_helper'

RSpec.describe "HandlingDeficits API", type: :request do
  describe "GET /api/v1/working_sessions/:working_session_id/handling_deficits" do
    it "returns all handling deficits for the working session serialized with camelCase keys" do
      working_session = create(:working_session)
      handling_deficits = [
        create(:handling_deficit, working_session: working_session, location: 'global'),
        create(:handling_deficit, working_session: working_session, location: 'high_speed', phase: 'entry')
      ]

      get "/api/v1/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body.size).to eq(2)
      expect(body.map { |hd| hd["id"] }).to match_array(handling_deficits.map(&:id))
      expect(body.first.keys).to match_array(%w[id workingSessionId location symptom phase createdAt])
    end

    it "returns an empty array when the working session has no handling deficits" do
      working_session = create(:working_session)

      get "/api/v1/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it "does not return handling deficits belonging to other working sessions" do
      working_session = create(:working_session)
      other_working_session = create(:working_session)
      create(:handling_deficit, working_session: other_working_session)

      get "/api/v1/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it "returns a 404 when the working session does not exist" do
      get "/api/v1/working_sessions/does-not-exist/handling_deficits"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Working session not found"] })
    end
  end

  describe "GET /api/v1/handling_deficits/:id" do
    it "returns the requested handling deficit" do
      handling_deficit = create(:handling_deficit)

      get "/api/v1/handling_deficits/#{handling_deficit.id}"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["id"]).to eq(handling_deficit.id)
      expect(body["workingSessionId"]).to eq(handling_deficit.working_session_id)
      expect(body["location"]).to eq(handling_deficit.location)
      expect(body["phase"]).to eq(handling_deficit.phase)
      expect(body["symptom"]).to eq(handling_deficit.symptom)
    end

    it "returns a 404 when the handling deficit does not exist" do
      get "/api/v1/handling_deficits/does-not-exist"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Handling deficit not found"] })
    end
  end

  describe "POST /api/v1/working_sessions/:working_session_id/handling_deficits" do
    it "creates a handling deficit for the given working session" do
      working_session = create(:working_session)

      expect {
        post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "global", symptom: "oversteer" } }
      }.to change(HandlingDeficit, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["workingSessionId"]).to eq(working_session.id)
      expect(body["location"]).to eq("global")
      expect(body["symptom"]).to eq("oversteer")
    end

    it "ignores unpermitted params via strong params" do
      working_session = create(:working_session)

      post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
           params: { handling_deficit: { location: "global", symptom: "oversteer", id: 999 } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["id"]).not_to eq(999)
    end

    it "returns unprocessable_content and does not persist when validations fail" do
      working_session = create(:working_session)

      expect {
        post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "front", symptom: "wobbly" } }
      }.not_to change(HandlingDeficit, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns a 404 when the working session does not exist" do
      post "/api/v1/working_sessions/does-not-exist/handling_deficits",
           params: { handling_deficit: { location: "global", symptom: "oversteer" } }

      expect(response).to have_http_status(:not_found)
    end

    it "returns unprocessable_content when a second global handling deficit is created for the working session" do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: "global")

      expect {
        post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "global", symptom: "understeer" } }
      }.not_to change(HandlingDeficit, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)["errors"]).to include("Phase has already been taken")
    end

    it "creates a handling deficit with a phase for a non-global location" do
      working_session = create(:working_session)

      post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
           params: { handling_deficit: { location: "high_speed", phase: "entry", symptom: "oversteer" } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["phase"]).to eq("entry")
    end

    it "returns unprocessable_content when phase is missing for a non-global location" do
      working_session = create(:working_session)

      post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
           params: { handling_deficit: { location: "high_speed", symptom: "oversteer" } }

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "returns unprocessable_content when phase is present for a global location" do
      working_session = create(:working_session)

      post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
           params: { handling_deficit: { location: "global", phase: "entry", symptom: "oversteer" } }

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "returns unprocessable_content when the location and phase combination is already used for the working session" do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: "high_speed", phase: "entry")

      expect {
        post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "high_speed", phase: "entry", symptom: "understeer" } }
      }.not_to change(HandlingDeficit, :count)

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "creates a second handling deficit for the same location with a different phase" do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: "high_speed", phase: "entry")

      expect {
        post "/api/v1/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "high_speed", phase: "mid_corner", symptom: "understeer" } }
      }.to change(HandlingDeficit, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH /api/v1/handling_deficits/:id" do
    it "updates the location and symptom" do
      handling_deficit = create(:handling_deficit, location: "global", symptom: "oversteer")

      patch "/api/v1/handling_deficits/#{handling_deficit.id}",
            params: { handling_deficit: { symptom: "understeer" } }

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["symptom"]).to eq("understeer")
      expect(handling_deficit.reload.symptom).to eq("understeer")
    end

    it "returns unprocessable_content when the update is invalid" do
      handling_deficit = create(:handling_deficit)

      patch "/api/v1/handling_deficits/#{handling_deficit.id}",
            params: { handling_deficit: { symptom: "wobbly" } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns a 404 when the handling deficit does not exist" do
      patch "/api/v1/handling_deficits/does-not-exist", params: { handling_deficit: { symptom: "understeer" } }

      expect(response).to have_http_status(:not_found)
    end

    it "returns unprocessable_content when updating to a location already used in the working session" do
      working_session = create(:working_session)
      create(:handling_deficit, working_session: working_session, location: "global")
      handling_deficit = create(:handling_deficit, working_session: working_session, location: "high_speed", phase: "entry")

      patch "/api/v1/handling_deficits/#{handling_deficit.id}",
            params: { handling_deficit: { location: "global" } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end
  end

  describe "DELETE /api/v1/handling_deficits/:id" do
    it "deletes the handling deficit" do
      handling_deficit = create(:handling_deficit)

      expect {
        delete "/api/v1/handling_deficits/#{handling_deficit.id}"
      }.to change(HandlingDeficit, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(HandlingDeficit.exists?(handling_deficit.id)).to be false
    end

    it "returns a 404 when the handling deficit does not exist" do
      delete "/api/v1/handling_deficits/does-not-exist"

      expect(response).to have_http_status(:not_found)
    end
  end
end
