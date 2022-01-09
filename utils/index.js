const { Ability, AbilityBuilder} = require('@casl/ability');

function getToken(req) {
    let token = 
        req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

    return token && token.length ? token : null;
}

// policy

const policies = {
    staff(user, {can}) {
        can('update', 'staff-profile', {user_id: user._id});
        can('view', 'staff-profile', {user_id: user._id});
        can('create', 'report')
    },
    admin(user, {can}){
        // can('manage', 'all');
        can('view', 'staff', {company: user.company});
        can('create', 'staff-profile', {company: user.company});
        can('update', 'staff-profile', {company: user.company});
        can('view', 'staff-detail', {company: user.company});
        can('delete', 'staff', {company: user.company});
    }
}

const policyFor = user => {
    let builder = new AbilityBuilder();
    if(user && typeof policies[user.role] === 'function') {
        console.log(`ini role ${user.role}`)
        policies[user.role](user, builder);
    }
    return new Ability(builder.rules)
}

module.exports = {
    getToken,
    policyFor
}