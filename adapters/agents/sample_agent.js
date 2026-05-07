// Sample local agent wrapper
module.exports = {
  id: 'sample-agent',
  name: 'Sample Agent',
  version: '0.1.0',
  async execute(input, context) {
    // Simple echo processor; replace with real logic
    return {
      success: true,
      input,
      context,
      output: `Processed: ${JSON.stringify(input)}`
    }
  }
}
