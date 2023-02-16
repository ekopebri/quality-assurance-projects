const {Controller} = require("./controller");
const {IssueService} = require("../services/issue.service");
class IssueController extends Controller {
    constructor() {
        super(null);
        this.service = new IssueService();
        this.createIssueByProject = this.createIssueByProject.bind(this);
        this.getIssueByProject = this.getIssueByProject.bind(this);
        this.updateIssueByProject = this.updateIssueByProject.bind(this);
        this.removeById = this.removeById.bind(this);
    }

    async createIssueByProject(req, res, next) {
        try {
            let data = req.body;
            data.project = req.params.project
            const response = await this.service.insert(data);
            return res.status(response.statusCode).json(response.data);
        }
        catch (e) {
            next(e);
        }
    }

    async getIssueByProject(req, res, next) {
        try {
            let query = { project: req.params.project, ...req.query };
            const response = await this.service.get(query);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async updateIssueByProject(req, res, next) {
        try {
            let data = req.body;
            const response = await this.service.update(data);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async removeById(req, res, next) {
        try {
            const id = req.body._id;
            const response = await this.service.remove(id);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new IssueController();