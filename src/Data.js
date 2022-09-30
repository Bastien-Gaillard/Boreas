let Data = class {
    constructor(city, description,timezone,country,temp) {
        this.city = city;
        this.description = description;
        this.timezone = timezone;
        this.country = country;
        this.temp = temp;
    }
    get city(){ 
        return this._city;
    }
    set city(value){ 
        this._city  = value;
    }
    get description(){ 
        return this._city;
    }
    set description(value){ 
        this._description  = value;
    }
    get timezone(){ 
        return this._timezone;
    }
    set timezone(value){ 
        this._timezone  = value;
    }
    get country(){ 
        return this._country;
    }
    set country(value){ 
        this._country  = value;
    }
    get temp(){ 
        return this._temp;
    }
    set temp(value){ 
        this._temp  = value;
    }
};