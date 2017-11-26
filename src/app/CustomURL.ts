import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class CustomUrlSerializer implements UrlSerializer {
    parse(url: any): UrlTree {
        const defaultSerializer = new DefaultUrlSerializer();
        return defaultSerializer.parse(url);
    }

    serialize(tree: UrlTree): any {
        const defaultSerializer = new DefaultUrlSerializer();
        const path = defaultSerializer.serialize(tree);
        // use your regex to replace as per your requirement.
        return path.replace(/(%20)|([\,\(\)])/g, '-');
    }
}