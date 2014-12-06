var Payload = require('../lib/payload'),
    assert = require('assert');

describe('Payload', function() {
    describe('construct', function() {
        it('should convert array to json', function(){
            var value = ['a','b','c'];
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(JSON.stringify(value), payload.content);
        });

        it('should convert object to json', function(){
            var value = {a : 'A', b : 'B', c: 'C'};
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(JSON.stringify(value), payload.content);
        });

        it('should treat a json string as json', function(){
            var value = JSON.stringify({a : 'A', b : 'B', c: 'C'});
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat an unformatted string as text/plain', function(){
            var value = 'A plain old string';
            var payload = new Payload(value);
            assert.equal('text/plain', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat an xml string as application/xml', function(){
            var value = '<?xml version="1.0" encoding="UTF-8" ?>' + "\n" + '<root>Value</root>';
            var payload = new Payload(value);
            assert.equal('application/xml', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat a html string as text/html', function(){
            var value = '<html>' + "\n" + '<html><head></head><body></body></html>';
            var payload = new Payload(value);
            assert.equal('text/html', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat a broken xml string as text/plain', function(){
            var value = '<?xml version="1.0" encoding="UTF-8" ?>' + "\n" + '<root Value</root>';
            var payload = new Payload(value);
            assert.equal('text/plain', payload.type);
            assert.equal(value, payload.content);
        });
    });
});

