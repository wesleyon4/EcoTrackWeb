#!/bin/bash

# Fix relative imports to shared schema
find ./client/src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../shared/schema"|from "../../../shared/schema"|g'
find ./client/src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../shared/schema"|from "../../shared/schema"|g'

# Fix imports for various hook files
find ./client/src/hooks -type f -name "*.ts" | xargs sed -i 's|from "./lib/queryClient"|from "../lib/queryClient"|g'
find ./client/src/hooks -type f -name "*.ts" | xargs sed -i 's|from "./hooks/use-toast"|from "./use-toast"|g'

echo "Import paths fixed!"