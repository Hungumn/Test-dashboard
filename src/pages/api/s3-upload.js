import moment from 'moment'
import { APIRoute } from 'next-s3-upload'
import { removeSpecialCharacter } from 'src/@core/utils/validator'

export default APIRoute.configure({
  async key(req, filename) {
    let projectId = req.body.projectId;
    let folder = req.body.folder
    const originFileName = `${removeSpecialCharacter(filename)}`
    const s3FileNamePrefix = moment().format('YYYYMMDD_HHmmss')
    const s3FileName = `${folder}/${projectId}/${s3FileNamePrefix}_${originFileName}`
    return `${s3FileName}`
  }
})
