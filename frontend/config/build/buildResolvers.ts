import { ResolveOptions } from "webpack"

export function buildResolvers(): ResolveOptions {
    return  {
            extensions: ['.js', '.tsx', '.ts', '.jsx']
        }
    
}
