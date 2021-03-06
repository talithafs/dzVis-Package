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

#-- getColumnsByCategory
.ERROR_CATEGORY = "Error: Category does not exist."

#-- applyOperation
.ERROR_OPERATION = "Error: Parameter 'identifier' does not represent a valid operation."

#-- createGoogleComboChart
.ERROR_GOOGLE_COMBO_1 = "Error: Line variable should be NULL when the group variable is NULL."
.ERROR_GOOGLE_COMBO_2 = "Error: Operation cannot be NULL when the line variable is not NULL."

#--createGoogleMotionChart
.ERROR_GOOGLE_MOTION = "Group variable cannot be NULL."

## Chart variables categories
.TARGET = "TARGET"
.GROUP = "GROUP"
.TIME = "TIME"
.KEY = "KEY"

## Global names for data.frame columns
.MAX = "MAXIMUM"
.MIN = "MINIMUM"

## Operations
.AVG = "Media"
.STD = "Desvio padrao"
.MEDIAN = "Mediana"
.NONE = "Nenhuma"

## Database types
.DB_INT = "int"
.DB_DOUBLE = "double"
.DB_ENUM = "enum"
.DB_VARCHAR = "varchar"
.DB_DATE = "date"
.DB_DATETIME = "datetime"
.DB_ALL = "*"
