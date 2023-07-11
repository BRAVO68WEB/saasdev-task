import Source from "../models/source.model";

export default class SourceService {
    async getSources() {
        return Source.find();
    }
    async getSource(name: string) {
        return Source.findOne({ name });
    }

    async getSourceById(id: string) {
        return Source.findById(id);
    }

    async removeSource(id: string) {
        return Source.findByIdAndDelete(id);
    }

    async create(name: string) {
        const newSource = new Source({
            name,
        });
        await newSource.save();
        return newSource.view(true);
    }

    async createOrUseSource(source: string) {
        const sourceExists = await this.getSource(source);

        if (sourceExists) {
            return sourceExists.view(true).id;
        } else {
            const newSource = await this.create(source);
            return newSource.id;
        }
    }
}
