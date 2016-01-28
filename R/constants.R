## Success messages
.VALID = "VALID"
.SUCCESS = "SUCCESS"

## Error messages

#-- validateLimits
.ERROR_LIMITS_1 = "Error: Invalid parameters. The minimum value and the maximum value must be of the same type."
.ERROR_LIMITS_2 = "Error: Invalid parameters. Both the minimum value and the maximum value must be numeric or represent a date."
.ERROR_LIMITS_3 = "Error: Invalid parameters. The minimum value can't be greater than or equal to the maximum value."
.ERROR_LIMITS_4 = "Error: Invalid parameters. The column type must match the minimum and the maximum value type."

#-- validateConsistency
.ERROR_CONSISTENCY_1 = "Error: Consistency problem. If there is more than one target variable, the group variable must represent categories."
.ERROR_CONSISTENCY_2 = "Error: Consistency problem. Each category must have the same number of observations."
.ERROR_CONSISTENCY_3 = "Error: Consistency problem. All categories must have observations for the same set of dates."

#-- validateGroupVariable
.ERROR_GROUP = "Error: Invalid parameters. This variable doesn't represent categories."

#-- validateTargetVariables
.ERROR_TARGET = "Error: Invalid parameters. This variable is not numeric."

#-- validateTimeVariable
.ERROR_TIME = "Error: Invalid parameters. This variable does not represent a date."


## Chart variables categories
.TARGET = "TARGET"
.GROUP = "GROUP"
.TIME = "TIME"
