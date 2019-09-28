function init()
    -- hash map
    hcreate('map_properties')
    hcreate('map_dids')
    hcreate('map_trust_anchors')
    -- For test key
    hset('map_dids', 'key', '1234')
    create_key('temp')
    end
    
    
    function register_trust_anchors(trust_did, trust_did_doc)
    -- only contract owner can add/update trust anchors.
    -- for trust issuer register
    if require_owner_auth()
    then
    hset('map_trust_anchors', tostring(trust_did), tostring(trust_did_doc))
    end
    end
    
    
    function register_properties(addr, properties)
    -- profile vc for holder
    -- issued by did contract or other third party organization
    hset('map_properties', tostring(addr), tostring(properties))
    end
    
    
    function register_did(did, pub)
    -- for holders register did address map
    -- local scheme = 'did:top:'
    -- local did = scheme..tostring(exec_account())
    local account = tostring(exec_account())
    local split = '#'
    hset('map_dids', tostring(did), account..split..tostring(pub))
    end