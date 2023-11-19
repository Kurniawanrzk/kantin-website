<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash, Validator};
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }
    
    public function login(Request $req)
    {
        $credentials = request(['email', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()
            ->json([
                "token" => $token,
                "token_type" => 'bearer',
                "expires_in" => auth()->factory()->getTTL() * 50
            ], 200);
    }

    public function register(Request $req)
    {
        $validator = Validator::make($req->all(), [
            "username" => "required",
            "email" => "required",
            "password" => "required",
            "name" => "required"
        ]);

        if ($validator->fails()) {
            return response()
                ->json([
                    "Message" => "Isi field body dengan benar!",
                    "Status" => false
                ], 400);
        }
        if (count(User::where("username", $req->username)->get())) {
            return response()
                ->json([
                    "Message" => "Username tidak tersedia",
                    "Status" => false
                ], 400);
        } else if (count(User::where("email", $req->email)->get())) {
            return response()
                ->json([
                    "Message" => "Email sudah digunakan",
                    "Status" => false
                ], 400);
        } else {
            $user = new User;
            $req->merge([
                "admin" => 0,
                "password" => Hash::make($req->password)
            ]);
            $user->fill($req->all());
            $user->save();
            return response($user);
        }
    }


    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }


}
