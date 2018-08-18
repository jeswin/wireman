export default function printErrorsAndExit(ex: any, projName: string) {
  if (ex.output) {
    for (const errorMessage of ex.output) {
      if (errorMessage) {
        console.log(errorMessage.toString().trim());
      }
    }
    console.log(`Aborted due to errors while building ${projName}.`);
    process.exit();
  }
}
