import Source from '../models/source.model';

export default class SourceService {
    async getSources() {
        return Source.find();
    }
    async getSource(name: string) {
        return Source.findOne({ name });
    }
}