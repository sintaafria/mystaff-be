const Report = require('./model');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        const report = await new Report({...payload, user: req.user._id});
        await report.save();
        return res.json(report);
    } catch(err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
};

const update = async (req, res, next) => {
    try{
        const payload = req.body;
        const { id } = req.params;
        const report = await Report.findByIdAndUpdate(id, payload);
        let subjectReport = subject('report', {user_id: report.user});
        let policy = policyFor(req.user);
        if(!policy.can('update', subjectReport)) {
            return res.json({
                error: 1,
                message: 'You are not allowed to modify this resource'
            })
        }
        await report.save();
        return res.json(report);
    } catch(err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try{
        const { id } = req.params;
        let report = await Report.findById(id);
        let subjectReport = subject('report', {user_id: report.user});
        let policy = policyFor(req.user);
        if(!policy.can('delete', subjectReport)) {
            return res.json({
                error: 1,
                message: 'You are not allowed to delete this resource'
            })
        }
        report = await Report.findByIdAndDelete(id);
        return res.json(report);
    } catch(err) {
        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { skip = 0, limit = 10, date='' } = req.query;

        let criteria = {user: id};

        if(date.length) {
            criteria = {
                ...criteria,
                date,
            }
        } 

        let count = await Report.find(criteria).countDocuments();

        let report = await Report
            .find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        return res.json({data: report, count});
    } catch(err) {
        next(err)
    }
}

module.exports = {
    store,
    update,
    destroy,
    index
}