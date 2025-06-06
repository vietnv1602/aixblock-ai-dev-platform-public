import { findAllPiecesDirectoryInSource } from '../utils/block-script-utils'
import { publishNxProject } from '../utils/publish-nx-project'

const publishPiece = async (nxProjectPath: string): Promise<void> => {
  console.info(`[publishPiece] nxProjectPath=${nxProjectPath}`)
  await publishNxProject(nxProjectPath)
}

const main = async () => {
  const piecesSource = await findAllPiecesDirectoryInSource()
  const publishResults = piecesSource.map(p => publishPiece(p))
  await Promise.all(publishResults)
}

main()