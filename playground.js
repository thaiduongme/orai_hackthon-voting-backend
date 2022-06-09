var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var processSchema = function (schema) {
    try {
        if (schema.oneOf || schema.anyOf) {
            var key = 'anyOf';
            if (schema.oneOf)
                key = 'oneOf';
            schema[key] = (schema.oneOf || schema.anyOf).map(function (item) { return (__assign(__assign({}, item), { title: item.required[0]
                    .replace(/_/g, ' ')
                    .replace(/(?<=^|\s+)\w/g, function (v) { return v.toUpperCase(); }) })); });
            return schema;
        }
        return schema;
    }
    catch (error) {
        console.log('process schema failed:', error);
        return null;
    }
};
console.log(processSchema({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'QueryMsg',
    anyOf: [
        {
            type: 'object',
            required: ['config'],
            properties: {
                config: {
                    type: 'object'
                }
            }
        },
        {
            type: 'object',
            required: ['token_stake'],
            properties: {
                token_stake: {
                    type: 'object',
                    required: ['address'],
                    properties: {
                        address: {
                            $ref: '#/definitions/HumanAddr'
                        }
                    }
                }
            }
        },
        {
            type: 'object',
            required: ['poll'],
            properties: {
                poll: {
                    type: 'object',
                    required: ['poll_id'],
                    properties: {
                        poll_id: {
                            type: 'integer',
                            format: 'uint64',
                            minimum: 0.0
                        }
                    }
                }
            }
        },
    ],
    definitions: {
        HumanAddr: {
            type: 'string'
        }
    }
}));
