using ESC2020.Model;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;


namespace ESC2020.Hubs {
    public class DataHub : Hub {
        public async Task nextParticipant(int electionId) {
            await Clients.All.SendAsync("nextParticipant", electionId);
        }

        public async Task updateObjections(int electionId) {
            await Clients.All.SendAsync("updateObjections", electionId);
        }

        public async Task endVote(int electionId) {
            await Clients.All.SendAsync("endVote", electionId);
        }

        public async Task userHasVoted(int electionId, int phaseId)
        {
            await Clients.All.SendAsync("userHasVoted", electionId, phaseId);
        }

        public async Task changeParticipants(int electionId, int phaseId) {
            await Clients.All.SendAsync("changeParticipants", electionId, phaseId);
        }

        public async Task validateCandidature(int electionId) {
            await Clients.All.SendAsync("validateCandidature", electionId);
        }
        public async Task updatePhase(int electionId) {
            await Clients.All.SendAsync("updatePhase", electionId);
        }

        public async Task newMessage(int electionId, Message message) {
            await Clients.All.SendAsync("newMessage", electionId, message);
        }

        public async Task participantHasObjected(int electionId) {
            await Clients.All.SendAsync("participantHasObjected", electionId);
        }
    }
}
