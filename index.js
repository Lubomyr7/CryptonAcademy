func assembleArgs(args []interface{}) ([]ArgumentMarshaling, error) {
	arguments := make([]ArgumentMarshaling, 0)
	for i, arg := range args {
		// generate dummy name to avoid unmarshal issues
		name := fmt.Sprintf("name%d", i)
		if s, ok := arg.(string); ok {
			arguments = append(arguments, ArgumentMarshaling{name, s, s, nil, false})
		} else if components, ok := arg.([]interface{}); ok {
			subArgs, err := assembleArgs(components)
			if err != nil {
				return nil, fmt.Errorf("failed to assemble components: %v", err)
			}
			arguments = append(arguments, ArgumentMarshaling{name, "tuple", "tuple", subArgs, false})
		} else {
			return nil, fmt.Errorf("failed to assemble args: unexpected type %T", arg)
		}
	}
	return arguments, nil
