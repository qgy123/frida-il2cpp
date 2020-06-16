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

if (Il2CppThread_Ptr) {
    let num = Memory.alloc(8);
    let assemblies = Il2cppApi.il2cpp_domain_get_assemblies(Il2cppApi.il2cpp_domain_get(), num);

    for (let index = 0; index < num.readU32(); index++) {
        let asm = Il2cppApi.il2cpp_assembly_get_image(assemblies.add(Process.pointerSize * index).readPointer());
        let name = Il2cppApi.il2cpp_image_get_name(asm);
        console.log(name.readAnsiString());
    }
}
