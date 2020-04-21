"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPRequestService = /** @class */ (function () {
    function HTTPRequestService(service, router) {
        this.service = service;
        this.router = router;
    }
    // api/Elections
    HTTPRequestService.prototype.getElectionById = function (electionId) {
        try {
            this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.updateElection = function (electionId, updatedElection) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.createElection = function (election, hostUser, code) {
        try {
            this.service.post(window.location.origin + "/api/Elections", {
                "Job": election.poste,
                "Mission": election.missions,
                "Responsability": election.responsabilite,
                "StartDate": election.dateD,
                "EndDate": election.dateF,
                "CodeElection": code,
                "HostId": hostUser.UserId,
                "ElectedId": null,
                "ElectionPhaseId": this.getPhasesById(1)['phaseId']
            }).subscribe(function (result) {
                return result;
            }, function (error) { return console.log(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.getElectionByCode = function (code) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    // api/Users
    HTTPRequestService.prototype.getUsersById = function (userId) {
        try {
            this.service.get(window.location.origin + "/api/Users/" + userId).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.updateUsers = function (userId, updatedUsers) {
        try {
            this.service.put(window.location.origin + "/api/Users/" + userId, {}).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.createUsers = function (user) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    // api/Participants
    HTTPRequestService.prototype.getParticipant = function (userId, electionId) {
        try {
            this.service.get(window.location.origin + "/api/Participants/" + userId + "/" + electionId).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.updateParticipant = function (electionId, userId, updatedParticipant) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.createParticipant = function (participant) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.getParticipantsByElection = function (electionId) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.getParticipantByElection = function (electionId, userId) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    // api/Phases
    HTTPRequestService.prototype.getPhasesById = function (phaseId) {
        try {
            this.service.get(window.location.origin + "/api/Phases/" + phaseId).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    // api/TypeOpininions
    HTTPRequestService.prototype.getTypeOpininionsById = function (typeOpinionId) {
        try {
            this.service.get(window.location.origin + "/api/TypeOpinions/" + typeOpinionId).subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    // api/Notifications
    HTTPRequestService.prototype.getNotifications = function () {
        try {
            this.service.get(window.location.origin + "/api/Notifications").subscribe(function (result) {
                return result;
            }, function (error) { return console.error(error); });
        }
        catch (e) {
            return null;
        }
    };
    HTTPRequestService.prototype.createNotifications = function (notification) {
        try {
            return null;
        }
        catch (e) {
            return null;
        }
    };
    return HTTPRequestService;
}());
exports.HTTPRequestService = HTTPRequestService;
//# sourceMappingURL=HTTPRequest.service.js.map