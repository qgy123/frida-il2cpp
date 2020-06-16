let Il2cppApi: any = {
    il2cpp_domain_get: ['pointer', []],
    il2cpp_domain_get_assemblies: ['pointer', ['pointer', 'pointer']],
    il2cpp_thread_current: ['pointer', []],
    il2cpp_thread_attach: ['pointer', ['pointer']],
    il2cpp_thread_detach: ['void', ['pointer']],
    il2cpp_assembly_get_image: ['pointer', ['pointer']],
    il2cpp_image_get_assembly: ['pointer', ['pointer']],
    il2cpp_image_get_name: ['pointer', ['pointer']],
    il2cpp_image_get_filename: ['pointer', ['pointer']],
    il2cpp_image_get_class_count: ['uint', ['pointer']],
    il2cpp_image_get_class: ['pointer', ['pointer', 'uint']],
    il2cpp_class_get_name: ['pointer', ['pointer']],
    il2cpp_class_get_namespace: ['pointer', ['pointer']],
    il2cpp_class_from_name: ['pointer', ['pointer', 'pointer', 'pointer']],
    il2cpp_class_get_methods: ['pointer', ['pointer', 'pointer']],
    il2cpp_class_get_method_from_name: ['pointer', ['pointer', 'pointer', 'int']],
    il2cpp_method_get_name: ['pointer', ['pointer']],
    il2cpp_method_get_class: ['pointer', ['pointer']]
}

for (const key in Il2cppApi) {
    if (Il2cppApi.hasOwnProperty(key)) {
        const addr = Module.findExportByName(null, key);
        Il2cppApi[key] = !addr
            ? () => { throw new Error('Export not found: ' + key) }
            : Il2cppApi[key] = new NativeFunction(addr, Il2cppApi[key][0], Il2cppApi[key][1]);
    }
}

let Il2CppThread_Ptr = Il2cppApi.il2cpp_thread_attach(Il2cppApi.il2cpp_domain_get());

if (!Il2CppThread_Ptr.isNull()) {
    let num = Memory.alloc(Process.pointerSize).writeUInt(0);
    let assemblies = Il2cppApi.il2cpp_domain_get_assemblies(Il2cppApi.il2cpp_domain_get(), num);

    for (let index = 0; index < num.readU32(); index++) {
        let img = Il2cppApi.il2cpp_assembly_get_image(assemblies.add(Process.pointerSize * index).readPointer());
        let name = Il2cppApi.il2cpp_image_get_name(img).readAnsiString();

        //console.log(name);

        if (name.indexOf("UnityEngine.dll")) {
            let cnt = Il2cppApi.il2cpp_image_get_class_count(img);
            for (let index = 0; index < cnt; index++) {
                let klass = Il2cppApi.il2cpp_image_get_class(img, index);
                let cName = Il2cppApi.il2cpp_class_get_name(klass).readAnsiString();
                //console.log(cName);
                if (cName === "Transform") {
                    let iter = Memory.alloc(Process.pointerSize).writeUInt(0);
                    let mInfo = Memory.alloc(Process.pointerSize).writeUInt(0);

                    let mGet_rotation = Il2cppApi.il2cpp_class_get_method_from_name(klass, Memory.allocUtf8String("get_rotation"), -1);
                    console.log("get_rotation at: " + mGet_rotation);

                    do {
                        mInfo = Il2cppApi.il2cpp_class_get_methods(klass, iter);
                        if (!mInfo.isNull()) {
                            //console.log(mInfo);
                            let mName = Il2cppApi.il2cpp_method_get_name(mInfo).readUtf8String();
                            console.log(mName);
                        }
                    } while (!mInfo.isNull());

                }

            }
        }
    }
}
